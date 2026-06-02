## Uso de Postman

El flujo correcto en Postman es: **Trabajos → Reviews** y, opcionalmente, **Reportes**.

Seguir un orden distinto puede romper la aplicación. Por ejemplo, si se realiza **Trabajos → Reporte → Reviews**, será posible crear tanto el reporte como la review, pero ese escenario no es el que el programa contempla ni valida.

Esto se debe a que el flujo completo de la aplicación integrada es el siguiente:

1. Se crea un trabajo.
2. Al finalizar el trabajo, se habilitan las reviews correspondientes.
3. Una vez realizadas las reviews, el usuario puede optar por generar un reporte.

Por lo tanto, en un entorno completamente integrado, el error mencionado nunca debería ocurrir de forma natural. Por lo que no se hacen esos controles, ya que asumimos una buena integración de la app externa.

Actualmente la app cuenta con todos los trabajos cargados, luego algunas reviews y reportes ya fueron agregados