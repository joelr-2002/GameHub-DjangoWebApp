
<p align="center">
  <a href="https://www.djangoproject.com/" target="blank"><img src="https://static.djangoproject.com/img/logos/django-logo-positive.svg" width="200" alt="Django Logo" /></a>
</p>

<p align="center">
Un proyecto Django para integrar distintos juegos accesibles desde una plataforma web.
</p>

<p align="center">
<img src="https://img.shields.io/badge/Django-3.2-green.svg" alt="Django Version" />
<img src="https://img.shields.io/badge/Python-3.x-blue.svg" alt="Python Version" />
<img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" alt="License" />
</p>

## Descripción

GameHub es un proyecto que integra distintos juegos accesibles desde una plataforma web. Este repositorio contiene el código necesario para configurar y ejecutar el proyecto localmente.

## Requisitos del sistema

Antes de comenzar, asegúrate de cumplir con los siguientes requisitos del sistema:

- Git
- Python 3.x
- Venv (para el entorno virtual del proyecto)
- MySQL
- Redis (opcional para comunicación en tiempo real)

## Configuración Inicial

Para descargar y utilizar el repositorio siga los siguiente pasos

## clonar repositorio
Clona el repositorio en tu máquina local:
``` git clone https://github.com/kevinhKit/pb-gamehub.git ```

## Activar el Entorno Virtual
Entrar en la carpeta del proyecto ``` pb-gamehub ```, si no tiene creado el entorno virtual, creelo con el siguiente comadno ``` python3 -m venv venv ```

Para usuarios de Unix o MacOS:

```
python3 -m venv venv
source venv/bin/activate
```
Para usuarios de Windows:

```
python -m venv venv
.\venv\Scripts\activate
```



## Instalar dependencias
```
pip install -r requirements.txt
```

## Crear una base de datos en MySQL
Asegúrate de tener MySQL instalado y luego crea una nueva base de datos.

## Configurar base de datos en django
Nota: Entrar en el archivo ``` settings.py  ``` del proyecto y configurar los meta datos de conexión

``` 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '<database>',
        'USER': '<username>',
        'PASSWORD': '<password>',
        'HOST': '<host>',
        'PORT': '<port>',
    }
}
```


## Realizar las migraciones
Para realizar las migraciones, ejecuta:
```
python manage.py migrate
```

## Cargar datos por defecto
Es fundamental cargar ciertos datos iniciales para que la aplicación funcione correctamente. Ejecuta los siguientes comandos para cargar los roles básicos en la base de datos:
### Roles de Usuarios por defecto
```
python manage.py loaddata initial_roles.json
```
### Categorias y Palabras `no` por defecto
```
python manage.py loaddata initial_data.json
```

## Crear un Superusuario
Para acceder al sitio de administración, necesitarás un superusuario. Crea uno con el siguiente comando:
```
python manage.py createsuperuser
```
Sigue las instrucciones en pantalla para completar la creación del superusuario. Se te pedirá un nombre de usuario, correo electrónico y contraseña.



## Ejecutar el servidor
Para levantar el servidor ejecuta, ejecuta:
```
python manage.py runserver
```

Visita http://127.0.0.1:8000 en tu navegador para acceder a la aplicación.

## Contribución
Agradecemos cualquier contribución a GameHub. Si deseas contribuir, por favor:
1. Haz un fork del repositorio.
2. Crea una rama para tu característica (`git checkout -b feature/<nuevaCaracteristica>`).
3. Realiza tus cambios y añade tests si es aplicable.
4. Envía un pull request con una descripción clara de los cambios y cualquier otra información relevante.


## Licencia
Este proyecto se distribuye bajo la Licencia MIT.
