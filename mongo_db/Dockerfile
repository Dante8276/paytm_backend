FROM mongo:latest
COPY initdb /docker-entrypoint-initdb.d/
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 27017
ENTRYPOINT ["entrypoint.sh"]
