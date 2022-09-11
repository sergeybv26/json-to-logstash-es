var path = require('path'),
    yargs = require('yargs'),
    colors = require('colors/safe'),
    util = require('util'),
    fs = require('fs'),
    _ = require('lodash')
    isVerboseOn = false;

process.on('uncaughtException', function(err) {

    if(isVerboseOn){
        console.log(colors.red(err.stack));
    }
    else{
        console.log(colors.red(err));
    }

});

var argv = yargs.usage('Usage: $0 -f [Исходный JSON файл] -o [Путь для выходного файла request-data.json]')
    .demand(['f'])
    .alias('f', 'file')
    .describe('f', 'Исходный JSON файл')
    .alias('o', 'output')
    .describe('o', 'Путь для выходного файла request-data.json')
    .default('o', './')
    .alias('v', 'verbose')
    .help('h')
    .alias('h', 'help')
    .epilog('Copyright 2022')
    .argv;

if(argv.verbose){
    isVerboseOn = true;
}

var stats = fs.statSync(argv.file);
if(!stats.isFile()){
    console.log(colors.red('Не удается найти входной файл: ', argv.file));
    exit(1);
}

var inputJsonString = fs.readFileSync(argv.file),
    inputJson;

try{
    inputJson = JSON.parse(inputJsonString);
}
catch(err){
    console.log(colors.red('Не удается выполнить парсинг входных данных', err));
    exit(1);
}

var outputStats = fs.statSync(argv.output);
if(!outputStats.isDirectory()){
    console.log(colors.red('[output] не корректная дирректория: ', argv.output));
    exit(1);
}

if(!_.isArray(inputJson)){
    console.log(colors.red('Содержимое входных данных JSON должно быть массивом'));
    exit(1);
}

var stream = fs.createWriteStream(path.join(argv.output, 'request-data.json'));
stream.on('finish', function() {
	console.log(colors.green('завершено, записано: ' + counter + ' строк'));
});

console.log(colors.gray('Выполняется запись...'));
var counter = 0;

stream.once('open', function(fd) {

    _.each(inputJson, function(record){
        delete record._id;
        // Для исключения ошибки превышения 1000 ключей в ES выполняем сохранение ряда параметров продукта в виде строки
        record.product_properties.product_ingredients = JSON.stringify(record.product_properties.product_ingredients);
        record.product_properties.product_nutrition = JSON.stringify(record.product_properties.product_nutrition);
        record.product_properties.product_information = JSON.stringify(record.product_properties.product_information);
        // Осуществляем вывод JSON объектов с разделением знаком переноса строки
        stream.write(JSON.stringify(record) + '\n');

        counter++;
    });

    stream.end();
});
