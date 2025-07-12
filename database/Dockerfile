FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=notesdb
ENV MYSQL_USER=appuser
ENV MYSQL_PASSWORD=apppass

# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1
