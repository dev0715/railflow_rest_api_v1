FROM nginx

EXPOSE 80 9000

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq \
 curl \
 git \
 ssh \
 gcc \
 make \
 build-essential \
 libkrb5-dev \
 sudo \
 vim \
 net-tools \
 apt-utils \
 supervisor \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install and copy Nginx
RUN apt-get update \
    && apt-get install -y nginx

COPY default.conf /etc/nginx/conf.d/

# Copy supervisord conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf



# Node deployment steps
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
