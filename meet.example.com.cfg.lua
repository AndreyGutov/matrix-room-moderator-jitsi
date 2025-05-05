irtualHost "meet.example.com"
    authentication = "token"  -- Использовать токены вместо "anonymous"
    app_id = "myappid"        -- Должно совпадать с JWT_APP_ID
    app_secret = "myappsecret" -- Должно совпадать с JWT_APP_SECRET
    allow_empty_token = true -- По умолчанию стояло true Запретить пустые токены

    ssl = {
        key = "/etc/prosody/certs/meet.example.com.key";
        certificate = "/etc/prosody/certs/meet.example.com.crt";
    }
    av_moderation_component = "avmoderation.meet.example.com"
    speakerstats_component = "speakerstats.meet.example.com"
    end_conference_component = "endconference.meet.example.com"

    modules_enabled = {
        "bosh";
        "ping"; 
        "speakerstats";
        "external_services";
        "conference_duration";
        "end_conference";
        "muc_lobby_rooms";
        "muc_breakout_rooms";
        "av_moderation";
        "room_metadata";
	      "jitsi_room_name";
    }
    c2s_require_encryption = false
    lobby_muc = "lobby.meet.example.com"
    breakout_rooms_muc = "breakout.meet.example.com"
    room_metadata_component = "metadata.meet.example.com"
    main_muc = "conference.meet.example.com"


Component "conference.meet.example.com" "muc"
    restrict_room_creation = false
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_meeting_id";
        "muc_domain_mapper";
        "polls";
        "token_verification";
      	"token_moderation";

	"matrix_creator_affiliation";
        "muc_rate_limit";
        "muc_password_whitelist";
    }
