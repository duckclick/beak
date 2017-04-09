FROM neoalienson/alpine-node-ruby

ENV NODE_ENV production
ENV RACK_ENV production
ENV PATH /root/.yarn/bin:$PATH
RUN apk update \
  && apk add curl bash binutils tar ruby-dev gcc g++ make libxml2-dev libxslt-dev python \
  && rm -rf /var/cache/apk/* \
  && /bin/bash \
  && touch ~/.bashrc \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apk del curl tar binutils

WORKDIR /opt/beak

ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN gem install bundler \
  && bundle config build.nokogiri --use-system-libraries \
  && bundle install --without development test

ADD frontend/yarn.lock frontend/yarn.lock
ADD frontend/package.json frontend/package.json
RUN cd frontend && yarn install

ADD . .

CMD [ "/bin/sh", "-c", "cd frontend && /root/.yarn/bin/yarn dist && cd - && /root/.yarn/bin/yarn run start"]
