import datetime
import random
import re

import noteworthy.botkit as botkit
import noteworthy.botkit.response as reply
import noteworthy.botkit.cache as cache

import docker
import aiohttp

class ChupaPost(reply.Response):
    def __init__(self, data, title):
        self.data = data
        self.title = title

    async def get_content(self, client):
        r = await client.upload(lambda x, y: self.data, 'text/html', filename = 'chupapost.html')

        return {
            'msgtype': 'm.chupacabra',
            'uri': r[0].content_uri,
            'body': self.title,
        }

@botkit.botkit_controller(bot_name='chupabot')
class ChupaBotController():

    AUTH = botkit.auth.PublicBot

    LAST_PROCESSED_TS = None

    RATE_LIMIT = {}

    THROTTLE_RATE = 30

    docker = docker.from_env()

    @botkit.botkit_method
    async def get(self, uri, title, **kwargs):
        # sup with this? https://github.com/aio-libs/aiohttp/issues/3698
        now = datetime.datetime.now()
        sender = kwargs['context']['event'].sender
        ts = kwargs['context']['event'].server_timestamp
        # skip already processed events TODO should be handled elsewhere
        if not self.LAST_PROCESSED_TS:
            with open('chupabot_last_event_ts', 'r') as ts_file:
                self.LAST_PROCESSED_TS = int(ts_file.read())
        if ts <= self.LAST_PROCESSED_TS:
            print('Already processed event, skipping')
            return None
        # TODO this prob bad cuz not async
        with open('chupabot_last_event_ts', 'w') as ts_file:
            ts_file.write(str(ts))
        self.LAST_PROCESSED_TS = ts

        # rate limiting
        if sender not in self.RATE_LIMIT:
            self.RATE_LIMIT[sender] = now + datetime.timedelta(seconds=self.THROTTLE_RATE)
        elif now < self.RATE_LIMIT[sender]:
            print(f'rate limiting user: {sender}')
            return reply.Notice('sorry, please try again in a few minutes')
        else:
            self.RATE_LIMIT[sender] = now + datetime.timedelta(seconds=self.THROTTLE_RATE)

# TODO move to external service
#        print(f'Got message: {uri}')
#        async with aiohttp.ClientSession() as session:
#            async with session.get(f'http://localhost:8000?uri={uri}') as response:
#                print("Status:", response.status)
#                print("Content-type:", response.headers['content-type'])
#                html = await response.text()

        html = self.docker.containers.run('singlefile', uri, auto_remove=True).strip()
        print('Sending reply...')
        return ChupaPost(html, title)