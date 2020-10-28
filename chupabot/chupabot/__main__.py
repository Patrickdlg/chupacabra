import os


from .chupabot import ChupaBotController


def main():
    creds = {
        'homeserver': os.environ['HS_URL'],
        'user': os.environ['CHUPABOT_MATRIX_ID'],
        'password': os.environ['CHUPABOT_PASSWORD']
    }
    bot = ChupaBotController.create_matrix_bot(creds)
    bot.run()