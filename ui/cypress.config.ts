import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
dotenv.config();

const username = `${process.env.IMS_USERNAME}`;
const password = `${process.env.IMS_PASSWORD}`;
const imsUrl = `${process.env.VITE_IMS_URL}`;
const frontendUrl = `${process.env.VITE_SNOMIO_UI_URL}`;

export default defineConfig({
  projectId: 'jvymjj',
  env: {
    frontend_url: frontendUrl,
    backend_url: '',
    ims_url: imsUrl,
    ims_username: username,
    ims_password: password,
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
