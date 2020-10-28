# ChupaBot

ChupaBot takes content from the Web and injects it into Matrix as a standalone html file.

By default ChupaBot will accept invitations from any user.

# Install

```
$ python setup.py install
```

# Run

```
$ export HS_URL=https://matrix.myhomeserver.com
$ export CHUPABOT_MATRIX_ID=@chupabot:myhomeserver.com
$ export CHUPABOT_PASSWORD=mypassword

# Start Chupabot
$ chupabot
```

# Usage

Invite ChupaBot to any Matrix channel, then:

```
!chupabot get https://www.wikipedia.org 'Wikipedia.org'
```