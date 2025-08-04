provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "my_ec2" {
  ami           = "ami-0c94855ba95c71c99"
  instance_type = "t3.micro"
  key_name      = "noor"

  tags = {
    Name = "MyTerraformEC2"
  }
}
