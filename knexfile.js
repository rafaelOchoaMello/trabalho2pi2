module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: '127.0.0.1',
            database: 'pi_t2',
            user: 'root',
            password: '2150'
        },
        migrations: {
            tableName: 'migrations',
            directory: 'database/migrations'
        },
        seeds: {
            directory: 'database/seeds'
        }
    }
};