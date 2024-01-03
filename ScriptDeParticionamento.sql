-- Função para criar a próxima partição do mês
CREATE OR REPLACE FUNCTION ponto.create_next_month_partition() RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    start_date := DATE_TRUNC('MONTH', NOW())::DATE;
    end_date := (start_date + INTERVAL '1 month')::DATE;
    partition_name := 'Registro_' || TO_CHAR(start_date, 'YYYYMM');

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = partition_name) THEN
        EXECUTE FORMAT('CREATE TABLE ponto.%I PARTITION OF ponto.Registro FOR VALUES FROM (%L) TO (%L)', partition_name, start_date, end_date);
        
        RAISE NOTICE 'Nova partição criada: %', partition_name;
    ELSE
        RAISE NOTICE 'A partição % já existe. Nenhuma ação necessária.', partition_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para agendar a criação da próxima partição no primeiro dia de cada mês
CREATE OR REPLACE FUNCTION ponto.schedule_next_month_partition_creation() RETURNS EVENT_TRIGGER AS $$
BEGIN
    PERFORM cron.schedule('0 0 1 * *', 'SELECT ponto.create_next_month_partition()');
END;
$$ LANGUAGE plpgsql;

-- Evento de Trigger para agendar a criação da próxima partição após comandos DDL
CREATE EVENT TRIGGER schedule_partition_creation
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE ponto.Registro', 'ALTER TABLE ponto.Registro')
EXECUTE FUNCTION ponto.schedule_next_month_partition_creation();
