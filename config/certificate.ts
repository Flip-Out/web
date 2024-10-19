import { createCA, createCert } from 'mkcert';

export const HOST = 'flipout.com';

export async function generateCertificate() {
  const ca = await createCA({
    organization: 'Hello CA',
    countryCode: 'NP',
    state: 'Bagmati',
    locality: 'Kathmandu',
    validity: 365,
  });

  const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: [HOST],
    validity: 365,
  });

  return { ca, cert };
}
