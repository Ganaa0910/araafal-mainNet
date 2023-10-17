import getConfig from "next/config";
//config from next config
const { publicRuntimeConfig } = getConfig();
const BACKEND_URL = `${publicRuntimeConfig.apiUrl}`;

const SERVER_SETTINGS = {
  BACKEND_URL,
};

export default SERVER_SETTINGS;
