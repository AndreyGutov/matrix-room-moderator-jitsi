Связка matrix-synapse + jitsi + keycloak. <br>
Создатель комнаты в matrix-synapse получает права модератора в jitsi, а остальные являются members. <br>
-
В keycloak нужно создать scopes, mappers (Type: Group Membership, Name: groups, Token Claim Name: groups), так же нужно добавить группу jitsiAdmin и включить в нее пользователей, данные пользователи будут получать доступ moderator во всех конференциях. 
 <br>
Модифицированы от jitsi-keycloak-adapter. добавлена отладка и передача комнаты.
adapter.ts
context.ts 
https://github.com/nordeck/jitsi-keycloak-adapter/blob/main/docs/setup-standalone.md
 <br>
Добавлена отладка. 
mod_token_moderation.lua
https://github.com/nvonahsen/jitsi-token-moderation-plugin/blob/master/mod_token_moderation.lua
 <br>
Модуль для matrix-synapse. 
Записывает название конференции jitsi в отдельный столбец для того что бы jitsi-keycloak-adapter мог извлечь название комнаты, создателя и установить модератора. 
conference_id_module.py - matrix-synapse mode 
 <br>
/opt/venvs/matrix-synapse/lib/python3.11/site-packages/conference_id_module.py 
 <br>
modules:
  - module: conference_id_module.ConferenceIdModule
    config: {}

 <br>

ALTER TABLE event_json ADD COLUMN conference_id TEXT;
 <br>
CREATE INDEX IF NOT EXISTS idx_event_json_conference_id ON event_json (conference_id);

------------------------------------------------------------------------------------------------------




