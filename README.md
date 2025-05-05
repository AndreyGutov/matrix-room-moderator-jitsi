/opt/venvs/matrix-synapse/lib/python3.11/site-packages/conference_id_module.py 

modules:
  - module: conference_id_module.ConferenceIdModule
    config: {}



ALTER TABLE event_json ADD COLUMN conference_id TEXT;

CREATE INDEX IF NOT EXISTS idx_event_json_conference_id ON event_json (conference_id);

------------------------------------------------------------------------------------------------------

https://github.com/nvonahsen/jitsi-token-moderation-plugin/blob/master/mod_token_moderation.lua

https://github.com/nordeck/jitsi-keycloak-adapter/blob/main/docs/setup-standalone.md
