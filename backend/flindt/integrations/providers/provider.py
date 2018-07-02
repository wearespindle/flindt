class Provider(object):
    """
    A Provider implements `send_message` which sends a message using a
    mechanism like email or Slack.
    """

    def send_message(self, message):
        """
        Send `message` to `user` using the users preferred channel.

        Args:
            message (str): A string containing the message.
        """
        raise NotImplementedError
