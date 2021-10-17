## Build Locally and run it in your local

install docker and doctl
configure doctl with your apitoken to access digital ocean docker repository.
and run below command to build from the root of repository -

```
docker build -t api:latest .
```
Once image is build then run docker container to access api -
```
docker run --rm -it  --name api -p 80:80 api:latest
```

