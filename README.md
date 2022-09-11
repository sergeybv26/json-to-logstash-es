# json-to-logstash-es
Утилита предназначена для преобразования JSON файла к виду, подходящему для загрузки в Elasticsearch через Logstash.

Осуществляет преобразование данных вида:
```
[
    {
        "key1": "value1",
        "key2": "value2",
        "key3": {
            "key4": "value4"
        }
    },
    {
        "key5": "value5",
        "key6": "value6",
    }
]
```
к виду:
```
{"key1": "value1", "key2": "value2", "key3": {"key4": "value4"}}
{"key5": "value5", "key6": "value6",}
```

## Ограничения
В утилите выполняется преобразование некоторых данных в строку, что необходимо под конкретный проект, для которого разрабатывается утилита. Для общего применения необходимо в файле index.js закомментировать строки:
```
record.product_properties.product_ingredients = JSON.stringify(record.product_properties.product_ingredients);
record.product_properties.product_nutrition = JSON.stringify(record.product_properties.product_nutrition);
record.product_properties.product_information = JSON.stringify(record.product_properties.product_information);
```

## Использование
### Подготовка к использованию
- Выполнить клонирование данного репозитория
- Выполнить команду `npm install`

### Преобразование данных
```
node index.js -f inputdata.json
```
В результате работы утилиты будет создан файл `request-data.json` в текущей дирректории. Созданный файл можно загружать в Elasticsearch через Logstash