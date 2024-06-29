import os
import io
import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))

# Add the current directory to the Python path
sys.path.append(current_dir)

from Google import Create_Service  # Assuming this is your custom module

CLIENT_SECRET_FILE = os.path.join(current_dir, 'credentials.json')
API_NAME = 'drive'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/drive']

def Create_Service(client_secret_file, api_name, api_version, *scopes):
    flow = InstalledAppFlow.from_client_secrets_file(client_secret_file, scopes)
    credentials = flow.run_local_server(port=8080)  # Ensure this matches your redirect URI
    service = build(api_name, api_version, credentials=credentials)
    return service

if os.path.exists('token.json'):
    os.remove('token.json')
    
# Start the authorization flow
print("Starting the authorization flow...")
service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

# After authorization, you can use the service to make API calls
# file_ids = ['1_ErbrUlYG8QSqYNmpqhaOO3ZzJGNmwTB']
file_ids = ['1UGOQyK26yhojOrOQ7PhnBgJ55nVaHXzo']
file_names = ['outputs.csv']

for file_id, file_name in zip(file_ids, file_names):
    request = service.files().get_media(fileId=file_id)

    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fd=fh, request=request)

    done = False

    while not done:
        status, done = downloader.next_chunk()
        print("Download progress: {0}".format(status.progress() * 100))

    fh.seek(0)

    os.makedirs('./Random Files', exist_ok=True)

    with open(os.path.join('./Random Files', file_name), 'wb') as f:
        f.write(fh.read())
