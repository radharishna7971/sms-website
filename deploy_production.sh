 #!/bin/bash

echo COPYING CLIENT/SERVER FILES
scp -r client/ root@107.170.195.138:smstudios-app
scp -r server/ root@107.170.195.138:smstudios-app
scp package.json root@107.170.195.138:smstudios-app
echo TUNNELING
ssh root@107.170.195.138 <<'ENDSSH'
export NODE_ENV=production
pm2 restart server
ENDSSH
echo COMPLETED
