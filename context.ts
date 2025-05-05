// -----------------------------------------------------------------------------
// This function creates the context inside JWT's payload. It gets userInfo
// (which comes from Keycloak) as parameter.
//
// Update the codes according to your requirements. Welcome to TypeScript :)
// -----------------------------------------------------------------------------

//export function createContext(userInfo: Record<string, unknown>) {
//  const groups = Array.isArray(userInfo.groups) ? userInfo.groups : [];
//  const isModerator = groups.includes('/jitsiAdmin');

//  const context = {
//    user: {
//      id: userInfo.sub,
//      name: userInfo.preferred_username || "",
//      email: userInfo.email || "",
//      lobby_bypass: true,
//      security_bypass: true,
//      moderator111: isModerator
//    },
//  };

//  return context;
//}

import { Pool } from 'pg';

export async function createContext(userInfo: Record<string, unknown>, room: string) {
  // Log the entire userInfo and room for debugging
  console.log('createContext: userInfo:', JSON.stringify(userInfo, null, 2));
  console.log('createContext: room:', room);

  // Initialize moderator as false by default
  let isModerator = false;

  // Check if user is in /jitsiAdmin group
  const groups = Array.isArray(userInfo.groups) ? userInfo.groups : [];
  if (groups.includes('/jitsiAdmin')) {
    isModerator = true;
    console.log('createContext: isModerator set to true from groups (/jitsiAdmin)');
  } else {
    console.log('createContext: User not in /jitsiAdmin group');
  }

  // Database connection configuration
  const pool = new Pool({
    host: 'ip address',
    database: 'db_name',
    user: 'db_user', // Replace with your PostgreSQL user
    password: 'password', // Replace with your PostgreSQL password
    port: 5432,
  });

  // Only query database if not already a moderator
  if (!isModerator) {
    try {
      // Extract conferenceId and username
      const conferenceId = room || '';
      const username = typeof userInfo.preferred_username === 'string'
        ? userInfo.preferred_username.replace(/:server_name\.example\.com$/, '') // replace server name
        : '';

      console.log('createContext: Extracted conferenceId:', conferenceId);
      console.log('createContext: Extracted username:', username);

      if (conferenceId && username) {
        // Query to find room_id and creator by conferenceId
        const query = `
          SELECT ej.room_id, r.creator
          FROM event_json ej
          JOIN rooms r ON ej.room_id = r.room_id
          WHERE ej.json::text ILIKE $1;
        `;
        console.log('createContext: Executing query with conferenceId:', conferenceId);
        const result = await pool.query(query, [`%${conferenceId}%`]);

        console.log('createContext: Query result:', JSON.stringify(result.rows, null, 2));

        if (result.rows.length > 0) {
          const { creator } = result.rows[0];
          // Normalize creator: remove '@' and domain
          const creatorUsername = creator.replace(/^@/, '').replace(/:server_name\.example\.com$/, ''); // replace server name
          console.log('createContext: Normalized creatorUsername:', creatorUsername);

          // Check if username matches creator
          if (creatorUsername === username) {
            isModerator = true;
            console.log('createContext: User matches creator, setting isModerator to true');
          } else {
            console.log('createContext: User does not match creator, isModerator remains false');
          }
        } else {
          console.log('createContext: No room found for conferenceId, setting isModerator to false');
          isModerator = false;
        }
      } else {
        console.log('createContext: Skipping database query due to missing conferenceId or username, isModerator remains false');
        isModerator = false;
      }
    } catch (error) {
      console.error('createContext: Error querying database for moderator check, setting isModerator to false:', error);
      isModerator = false;
    } finally {
      await pool.end();
      console.log('createContext: Database connection closed');
    }
  } else {
    console.log('createContext: Skipping database query as user is already moderator');
  }

  const context = {
    user: {
      id: userInfo.sub || '',
      name: userInfo.preferred_username || '',
      email: userInfo.email || '',
      lobby_bypass: true,
      security_bypass: true,
      moderator: isModerator,
    },
  };

  console.log('createContext: Generated context:', JSON.stringify(context, null, 2));
  console.log('createContext: Returning context for tokenization');

  return context;
}
