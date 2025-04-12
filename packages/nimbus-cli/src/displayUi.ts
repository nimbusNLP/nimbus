import { serveUi } from 'nimbus-ui-server';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


export async function displayUi(nimbusLocalStoragePath:string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dotEnvFilePath = path.join(__dirname, '..', '..', '.env');
  
  dotenv.config({path: dotEnvFilePath});

  const apiGatewayBaseUrl = process.env.API_GATEWAY_URL;
  const nimbusApiKey = process.env.API_KEY;

  await serveUi(nimbusLocalStoragePath, apiGatewayBaseUrl, nimbusApiKey ); 
}
