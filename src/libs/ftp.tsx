import { Client } from "basic-ftp";

let ftpClient: Client | null = null;
export async function useFtp() {
  if (ftpClient && !ftpClient.closed) return ftpClient;
  ftpClient = new Client();
  ftpClient.ftp.verbose = true;
  try {
    await ftpClient.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
  return ftpClient;
}
