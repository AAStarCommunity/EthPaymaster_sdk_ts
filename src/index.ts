import axios from 'axios';
import { HealthRes, AuthRes, EntryPointRes, StrategyRes, UserOpReq, TryPayUserOpRes } from './types/response'
import Path from "./utils/path";

/**
 * Change the base url to the production or development url
 * 
 * @param isProdUrl is production url
 */
export function init(isProdUrl = true) {
  axios.defaults.baseURL = isProdUrl ? "https://EthPaymaster.org" : "https://relay-ethpaymaster-pr-20.onrender.com";
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.interceptors.response.use(function (response) {
    // return data value
    // if (response?.data?.token && response?.data?.expire) {
    //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + response?.data?.token;
    // }
    return response?.data || response;
  }, function (error) {
    return Promise.reject(error.toJSON());
  });
}

/**
 * 
 * @returns server is health or not
 */
export const health = (): Promise<HealthRes | any> => {
  return axios.get(Path.Health)
}

/**
 * 
 * @param apiKey 
 * @returns 
 */
export const auth = (apiKey: string): Promise<AuthRes | any> => {
  return axios.post(Path.Auth, { apiKey: apiKey }).then(res => {
    //@ts-ignore
    if (res && res?.token && res?.expire) {
      //@ts-ignore
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res?.token;
    }
    return res;
  });
}

export const getSupportEntryPointV1 = (network = "Network"): Promise<EntryPointRes | any> => {
  return axios.get(Path.GetSupportEntryPointV1, { params: { network } })
}

export const getSupportStrategyV1 = (network = 'ethereum'): Promise<StrategyRes | any> => {
  return axios.get(Path.GetSupportStrategyV1, { params: { network } })
}

export const tryPayUserOperationV1 = (data: UserOpReq): Promise<TryPayUserOpRes | any> => {
  return axios.post(Path.TryPayUserOperationV1, {
    force_strategy_id: data.forceStrategyId,
    user_operation: {
      call_data: data.userOperation.callData,
      call_gas_limit: data.userOperation.callGasLimit,
      max_priority_fee_per_gas: data.userOperation.maxPriorityFeePerGas,
      nonce: data.userOperation.nonce,
      pre_verification_gas: data.userOperation.preVerificationGas,
      sender: data.userOperation.sender,
      signature: data.userOperation.signature,
      verification_gas_limit: data.userOperation.verificationGasLimit,
      paymaster_and_data: data.userOperation.paymasterAndData
    }
  })
}
