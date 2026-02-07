export default () => [
    {
        name: "test-site",
        domains: { main: "test.example.com" },
        public: {
            apiKey: "{{ op://vault/item/api-key }}",
            apiSecret: "{{ op://vault/item/api-secret }}",
            dbPassword: "{{ op://vault/database/password }}",
        },
    },
];
