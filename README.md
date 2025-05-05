Связка matrix-synapse + jitsi + keycloak. 
Создатель комнаты в matrix-synapse получает права модератора в jitsi, а остальные являются members.
В keycloak нужно создать mappers, так же нужно добавить группу jitsiAdmin и включить в нее пользователей, данные пользователи будут получать доступ moderator во всех конференциях. 


Модифицированы от jitsi-keycloak-adapter. добавлена отладка и передача комнаты.
adapter.ts
context.ts 
https://github.com/nordeck/jitsi-keycloak-adapter/blob/main/docs/setup-standalone.md

Добавлена отладка. 
mod_token_moderation.lua
https://github.com/nvonahsen/jitsi-token-moderation-plugin/blob/master/mod_token_moderation.lua

Модуль для matrix-synapse. 
Записывает название конференции jitsi в отдельный столбец для того что бы jitsi-keycloak-adapter мог извлечь название комнаты, создателя и установить модератора. 
conference_id_module.py - matrix-synapse mode 

/opt/venvs/matrix-synapse/lib/python3.11/site-packages/conference_id_module.py 

modules:
  - module: conference_id_module.ConferenceIdModule
    config: {}



ALTER TABLE event_json ADD COLUMN conference_id TEXT;

CREATE INDEX IF NOT EXISTS idx_event_json_conference_id ON event_json (conference_id);

------------------------------------------------------------------------------------------------------




