import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://biblio-teco-davidlaramedia.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY4ODQ0MjcsImlkIjoiMDE5ZGI2OTAtMjQwMS03YzMxLTkyMGYtN2JhNDBjZWM2ZDVhIiwicmlkIjoiZTQ4YjMxZjItOGVkYi00ZjQzLTk1YjMtN2ZjNmVmZTQ1YWI5In0.guR3AsKANSKt66ewk6-pf1QY2NJF0UjGn1XYyZHWNcqo8kuJ1X3AD5SOmba7wXJxgLt6_90dUPNFxwTsNZCKAg",
});

client.execute("SELECT COUNT(*) as count FROM notes").then((r) => {
  console.log("Total notas:", r.rows[0].count);
});