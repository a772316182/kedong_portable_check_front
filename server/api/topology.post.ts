import { defineEventHandler, readBody } from 'h3';
import { pscClient } from '~/server/api/pscClient';
import type { SaveTopologyParams, SaveTopologyResponse } from '~/types/api';
import type { RpcError } from 'grpc-web';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<SaveTopologyParams>(event);
    const { stationId, topology_json } = body;

    if (!stationId || !topology_json) {
      return {
        retNum: 1,
        errMessage: 'stationId and topology_json are required',
      };
    }

    return new Promise((resolve) => {
      pscClient.SaveTopology({ station_id: stationId, topology_json }, (err: RpcError | null, response: SaveTopologyResponse | null) => {
        if (err) {
          console.error('gRPC Error on SaveTopology:', err);
          resolve({
            retNum: 1,
            errMessage: `gRPC Error: ${err.message}`,
          });
        } else {
          resolve({
            retNum: response?.retNum,
            errMessage: response?.errMessage,
          });
        }
      });
    });
  } catch (error: any) {
    console.error('Error reading request body:', error);
    return {
      retNum: 1,
      errMessage: `Failed to process request: ${error.message}`,
    };
  }
}); 