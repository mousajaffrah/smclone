provider "aws" {
  region = "us-east-1"
}

data "aws_ami" "free_tier_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "my_ec2" {
  ami           = data.aws_ami.free_tier_amazon_linux.id
  instance_type = "t2.micro"
  associate_public_ip_address = true

  tags = {
    Name = "MyTerraformEC2"
  }
}
