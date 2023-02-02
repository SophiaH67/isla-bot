use std::env;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();
    let args: Vec<String> = args[1..].to_vec();

    let client = reqwest::Client::new();
    let res = client
        .post("http://localhost:1515/command")
        .body(args.join(" "))
        .header("Content-Type", "text/plain")
        .timeout(std::time::Duration::from_secs(10))
        .send()
        .await
        .unwrap();

    let body = res.text().await.unwrap();
    println!("{}", body);
}
