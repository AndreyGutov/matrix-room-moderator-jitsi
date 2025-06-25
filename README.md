# Matrix-Synapse + Jitsi + Keycloak.

## The creator of a room in matrix-synapse gets moderator rights in jitsi, and the rest are members. 

- **KEYCLOAK:**
	Create scopus, mappers (Type: Group Membership, Name: groups, Token Claim Name: groups), you also need to add a jitsiAdmin group and include users in it, these users will receive moderator access in all conferences.

- **JITSI-KEYCLOAK-ADAPTER:** <br>
The following files have been modified:<br>
adapter.ts<br>
context.ts <br>

	added debugging and room transfer.<br>
	link to the original:
	https://github.com/nordeck/jitsi-keycloak-adapter/blob/main/docs/setup-standalone.md

- **JITSI-TOKEN-MODERATOR:** <br>
The following files have been modified: <br>
mod_token_moderation.lua

	added debugging.<br>
	link to the original: https://github.com/nvonahsen/jitsi-token-moderation-plugin/blob/master/mod_token_moderation.lua

- **MODULE FOR MATRIX-SYNAPSE.** <br> 
Writes the name of the jitsi conference in a separate column so that the jitsi-keycloak adapter can extract the name of the room, the creator, and install the moderator.<br>
path: /opt/venvs/matrix-synapse/lib/python3.11/site-packages/conference_id_module.py

	#### connecting the module in the matrix configuration file: <br>

	modules:<br>
  		module: conference_id_module.ConferenceIdModule <br>
  	 		config: {}<br>

	#### Creating tables and indexes <br>
		ALTER TABLE event_json ADD COLUMN conference_id TEXT;
		CREATE INDEX IF NOT EXISTS idx_event_json_conference_id ON event_json (conference_id);
