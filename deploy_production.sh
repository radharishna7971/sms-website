 #!/bin/bash

echo COPYING CLIENT/SERVER FILES
scp -r client/ chris@45.55.23.74:codesnap
scp -r server/ chris@45.55.23.74:codesnap
echo TUNNELING
ssh root@107.170.195.138 <<'ENDSSH'
export NODE_ENV=production
pm2 restart server
ENDSSH
echo COMPLETED
