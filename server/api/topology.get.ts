import { defineEventHandler, getQuery } from 'h3';
import { pscClient } from '~/server/api/pscClient';
import type { GetTopologyResponse } from '~/types/api';
import type { RpcError } from 'grpc-web';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const stationId = query.stationId as string;

  if (!stationId) {
    return {
      retNum: 1,
      errMessage: 'stationId is required',
      topology_json: ''
    };
  }

  return new Promise((resolve) => {
    pscClient.GetTopology({ station_id: stationId }, (err: RpcError | null, response: GetTopologyResponse | null) => {
      if (err) {
        console.error('gRPC Error on GetTopology:', err);
        resolve({
          retNum: 1,
          errMessage: `gRPC Error: ${err.message}`,
          topology_json: ''
        });
      } else {
        resolve({
          retNum: response?.retNum,
          errMessage: response?.errMessage,
          topology_json: response?.topology_json
        });
      }
    });
  });
}); 