from synapse.module_api import ModuleApi
import logging
import json

logger = logging.getLogger(__name__)

class ConferenceIdModule:
    def __init__(self, config, api: ModuleApi):
        self._api = api
        api.register_third_party_rules_callbacks(
            on_create_room=self.on_create_room,
            on_new_event=self.on_new_event,
        )
        logger.info("ConferenceIdModule initialized")

    @staticmethod
    def parse_config(config):
        return config

    async def on_create_room(self, requester, config, *args, **kwargs):
        logger.info("Room creation detected: %s", config)
        return None

    async def on_new_event(self, event, *args, **kwargs):
        # Convert FrozenEventV3 to dict for logging
        event_dict = event.get_dict()
        logger.debug("Processing event: %s", json.dumps(event_dict, indent=2))

        # Log event_id directly from event
        event_id = getattr(event, "event_id", None)
        logger.debug("Event ID: %s", event_id)

        content = event_dict.get("content", {})
        conference_id = None

        # Check possible locations for conferenceId
        if content.get("conferenceId"):
            conference_id = content.get("conferenceId")
        elif content.get("data", {}).get("conferenceId"):
            conference_id = content.get("data", {}).get("conferenceId")
        elif content.get("jitsi_conference"):
            conference_id = content.get("jitsi_conference")
        elif content.get("widget", {}).get("content", {}).get("conferenceId"):
            conference_id = content.get("widget", {}).get("content", {}).get("conferenceId")
        # Add more checks as needed

        if conference_id and event_id:
            logger.info("Found conferenceId: %s in event: %s (room: %s)", 
                       conference_id, event_id, event_dict.get("room_id"))
            try:
                # Use run_db_interaction for SQL query
                await self._api.run_db_interaction(
                    "update_conference_id",
                    lambda txn: txn.execute(
                        """
                        UPDATE event_json
                        SET conference_id = %s
                        WHERE event_id = %s
                        """,
                        [conference_id, event_id]
                    )
                )
                logger.info("Successfully updated conference_id for event: %s", event_id)
            except Exception as e:
                logger.error("Failed to update conference_id for event %s: %s", 
                            event_id, str(e))
        else:
            logger.debug("No conferenceId or event_id found: conference_id=%s, event_id=%s", 
                        conference_id, event_id)

        return None
