
var previous_random_number;

do{
current_random_number = Math.floor(Math.random() * 5);
}
while( current_random_number == previous_random_number);

current_random_number = 