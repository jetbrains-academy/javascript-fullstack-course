Docker compose demo

Changes:
### Backend
- `database.sqlite` moved to the `backend/data` to place in into the docker volume
- Updated path to the `database.sqlite` in `dbConfig.js`
- Added `/health` route in `index.js`
- `.env` file was moved from `backend` folder to the top project folder -- 
  think about this one more time later. Maybe change to the docker secrets. 

### Frontend
- Images (`academy.svg` and `delete.svg`) were moved to the `public/assets` folder.
  This is a default folder for resources and built by a Vite project is ready to be used by nginx.
- Updated paths to the images in `Chat.jsx` and `index.html`
- Added script `build` in `package.json`
- Made changes in the `vite.config.js` to take `backendUrl` from the env

### Docker
- `Dockerfile`'s in the `backend` and `frontend` folders
- `frontend/nginx.conf` for current nginx usage
- `docker-compose.yml`