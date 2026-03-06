# 🚀 Crowdfunding en Solana (Anchor)

Un proyecto de contrato inteligente (Smart Contract) de nivel intermedio construido en Solana usando el framework **Anchor** y probado en **Solana Playground (SolPG)**. 

Este programa permite a los usuarios crear campañas de recaudación de fondos, recibir donaciones en SOL de otros usuarios y retirar los fondos de manera segura (solo el administrador de la campaña).

## ✨ Características Principales

* **Program Derived Addresses (PDAs):** Cada campaña vive en una dirección única derivada de la clave pública del creador y una semilla (`"CAMPAIGN_DEMO"`). Esto garantiza que el programa tenga autoridad sobre la cuenta sin necesidad de una clave privada.
* **Cross-Program Invocations (CPI):** Utiliza el `system_program` de Solana nativo para transferir SOL de la billetera del donante a la cuenta PDA de la campaña.
* **Gestión de Renta (Rent Exemption):** El programa valida de forma segura que los retiros no dejen la cuenta de la campaña con un saldo inferior al mínimo requerido por la red para existir, evitando que la cuenta sea purgada de la blockchain.
* **Control de Acceso:** Solo la billetera que creó la campaña (el `admin`) puede ejecutar la instrucción de retiro (`withdraw`).

## 📂 Estructura del Proyecto

* `src/lib.rs`: Contiene la lógica principal del contrato inteligente en Rust.
* `client/client.ts`: Script interactivo en TypeScript para interactuar con el contrato directamente desde la consola (crear campaña automáticamente si no existe y leer los datos).
* `tests/anchor.test.ts`: Suite de pruebas automatizadas usando el módulo nativo `assert` para validar la creación, donación y retiro de fondos.

## 🛠️ Requisitos Previos

No necesitas instalar nada en tu computadora local. Todo el proyecto está diseñado para ejecutarse en el navegador usando [Solana Playground](https://beta.solpg.io/).

* Una billetera de SolPG conectada a la **Devnet**.
* Al menos 2 SOL de prueba (puedes obtenerlos escribiendo `solana airdrop 2` en la terminal de SolPG).

## 🚀 Cómo Ejecutar el Proyecto en SolPG

### 1. Configuración Inicial
1. Crea un nuevo proyecto Anchor en Solana Playground.
2. Copia el código de `lib.rs`, `client.ts` y `anchor.test.ts` en sus respectivas carpetas.
3. Asegúrate de que tu billetera esté conectada (esquina inferior izquierda).

### 2. Compilación y Despliegue
1. Haz clic en el ícono del **Martillo (Build)** en la barra lateral izquierda.
2. Ve al ícono de **Solana** y haz clic en **Deploy**.
3. **¡Importante!** Copia el `Program ID` que aparece tras desplegar, pégalo en el `declare_id!("...");` de tu archivo `lib.rs` y vuelve a darle a **Build** y **Deploy**.

### 3. Ejecutar las Pruebas (Tests)
Ve a la pestaña con el ícono del **Matraz de laboratorio** y haz clic en **Test**. Esto validará que todo el flujo del contrato funcione correctamente en la Devnet.

### 4. Ejecutar el Cliente Interactivo
En la terminal integrada de SolPG, escribe el siguiente comando para ver el estado de tu campaña en vivo:

```bash
run client/client.ts
