export default () => [
    {
        name: "test-site",
        domains: { main: "test.example.com" },
        public: { apiKey: "{{ op://vault/item/password }}" },
    },
];
