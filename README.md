# Caesar
RS School NodeJS course


Приложения для кодирования и декодирования текста с помощью шифра
[Цезаря](https://en.wikipedia.org/wiki/Caesar_cipher).


#### Как запустить приложение
Скачать и установить [NodeJS](https://nodejs.org/en/download/).

Скачать приложение используя **git** или архивом.

Открыть консоль из папки **src**

Ввести в консоль команду **node main.mjs** с доступными параметрами

#### Доступные параметры

```bash
Usage: main [options] Доступные параметры

Options:
  -a, --action <action>  an action 'encode' or 'decode'
  -i, --input  [path]    an input file or use stdin as an input source
  -o, --output [path]    an output file or use stdout as an output destination
  -s, --shift <number>   a shift
  -h, --help             display help for command
```

#### Примеры использования

Кодирование данных, чтение из файла и запись результата в другой файл, с шагом 10
```bash
$ node main.mjs --action encode --shift 10 --input input.txt --output output.txt
```
Кодирование данных, чтение из файла с выводом в консоль, с шагом -72
```bash
$ node main.mjs --action encode --shift -72 --input input.txt
```
Декодирование данных, ввод из консоли и запись в файл, с шагом 15
```bash
$ node main.mjs --action decode --shift 15 --output output.txt
```
Кодирование данных, ввод и вывод через консоль, с шагом 54
```bash
$ node main.mjs --action encode --shift 54
```
