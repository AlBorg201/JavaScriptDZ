module.exports = {
  apps: [
    {
      name: 'contacts-api',
      script: './server.js',
      instances: 'max', // Использовать максимум CPU ядер (кластеризация)
      exec_mode: 'cluster', // Режим кластеризации
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false, // Отключить наблюдение за файлами в продакшене
      max_memory_restart: '1G', // Перезапустить при использовании 1GB памяти
      autorestart: true, // Автоматический перезапуск при сбоях
      error_file: './logs/err.log', // Логи ошибок
      out_file: './logs/out.log', // Логи вывода
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};