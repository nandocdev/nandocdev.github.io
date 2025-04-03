
# NandocDev

Este proyecto es una página web diseñada para **NandocDev**, una plataforma de servicios para startups. Este repositorio incluye una página web responsiva que cubre múltiples secciones, como hero, servicios, características, precios, FAQ y contacto. Además, implementa un formulario de contacto utilizando Google Forms para almacenar mensajes directamente en Google Sheets sin necesidad de un backend.

## Índice

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción

**NandocDev** es una plataforma diseñada para proporcionar herramientas y recursos a startups. Esta página web está pensada para ser simple, clara y efectiva, enfocada en ofrecer información sobre los servicios y características de la plataforma, así como permitir a los usuarios ponerse en contacto de manera sencilla mediante un formulario de contacto.

## Características

- **Secciones principales**: Home, About, Services, Features, Pricing, FAQ, Contact.
- **Formulario de contacto integrado con Google Forms**: Al enviar el formulario, los datos se almacenan automáticamente en una hoja de Google Sheets.
- **Responividad**: El diseño se adapta perfectamente a dispositivos móviles y de escritorio.
- **Interactividad**: Uso de AOS (Animate On Scroll) para transiciones suaves.

## Tecnologías Utilizadas

- **HTML5**: Estructura básica del contenido.
- **CSS3**: Estilo y diseño responsivo de la página.
- **JavaScript**: Interactividad y manejo del formulario de contacto.
- **Bootstrap**: Framework CSS para diseño y componentes responsivos.
- **Google Forms**: Para gestionar el formulario de contacto y almacenar respuestas en Google Sheets.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
NandocDev/
│
├── assets/                  # Archivos estáticos como imágenes y fuentes
│   ├── css/                 # Archivos CSS personalizados
│   ├── img/                 # Imágenes y gráficos
│   ├── js/                  # Scripts de JavaScript
│   └── fonts/               # Fuentes utilizadas en el proyecto
│
├── index.html               # Página principal
├── pricing.html             # Página de precios
└── README.md                # Este archivo
```

## Instalación

Para comenzar a trabajar con este proyecto localmente, sigue estos pasos:

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/NandocDev.git
```

2. Navega a la carpeta del proyecto:

```bash
cd NandocDev
```

3. Abre el archivo `index.html` en tu navegador preferido.

## Uso

### Formulario de Contacto

Este proyecto utiliza **Google Forms** para gestionar el formulario de contacto. Los datos del formulario son enviados directamente a Google Sheets. Para usar el formulario:

1. Ve a la página de contacto en el sitio web.
2. Completa los campos del formulario: Nombre, Correo Electrónico, Asunto, Mensaje.
3. Haz clic en **Enviar**. Los datos serán enviados y almacenados en Google Sheets.

### Personalización de Google Forms

Para personalizar el formulario de contacto en Google Forms:

1. Crea un nuevo formulario en [Google Forms](https://forms.google.com).
2. Agrega los campos correspondientes (por ejemplo: nombre, correo, asunto, mensaje).
3. Obtén el enlace de acción del formulario (ver [paso 2](#paso-2-obteniendo-el-formulario-en-formato-html)).
4. Sustituye la URL en el archivo JavaScript con el enlace de acción de tu formulario.

### Animaciones de AOS

Este proyecto utiliza **AOS (Animate On Scroll)** para agregar animaciones a los elementos al hacer scroll. Para personalizar las animaciones:

1. Abre el archivo `index.html`.
2. En el atributo `data-aos`, puedes cambiar las animaciones (por ejemplo, `fade-up`, `zoom-in`, etc.).

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un **fork** de este repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature-nueva-funcionalidad`).
5. Abre un **pull request**.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
