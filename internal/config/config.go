package config

type Config struct {
	ServerAddress string
	Environment   string
}

func Load() *Config {
	return &Config{
		ServerAddress: ":8080",
		Environment:   "development",
	}
}
