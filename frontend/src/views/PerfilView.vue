<template>
    <div>
        <div class="row">
            <div class="col-md-3">
                <div class="card m-1">
                    <div class="card-body">

                        <div class="text-center">
                            <img src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png"
                                alt="Avatar" class="img-fluid rounded-circle border border-warning" width="200"
                                height="200">

                            <br>
                            <button type="button" class="btn btn-dark btn-sm my-3">
                                <i class="fa fa-camera"></i>
                            </button>
                        </div>

                        <h5 class="text-center">Jose Mamani</h5>

                        <div class="text-center">
                            <span class="badge bg-success ">Online!</span>
                        </div>


                    </div>
                </div>
            </div>

            <div class="col-md-9">
                <div class="card m-1">
                    <div class="card-body">

                        <h3 class="card-title">Datos personales </h3>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="nombres" class="form-label">Nombres</label>
                                    <input type="text" v-model="nombres" id="nombres" class="form-control" />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="apellidos" class="form-label">Apellidos</label>
                                    <input type="text" v-model="apellidos" id="apellidos" class="form-control" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="correo" class="form-label">Correo</label>
                                    <input type="email" v-model="correo" id="correo" class="form-control" />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="password" class="form-label">Contraseña</label>
                                    <input type="password" v-model="password" id="password" class="form-control" />
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <button type="button" @click="actualizar()" class="btn btn-primary">Actualizar
                                datos</button>
                        </div>

                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const route = useRouter();

let baseURL = 'http://localhost:3000/users';

const miID = ref(0);
const nombres = ref('');
const apellidos = ref('');
const correo = ref('');
const password = ref('');

const token = localStorage.getItem('token') || '';
const header = {
    headers: {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

onMounted(() => {

    if (token == '' || token == null) {
        expirado();
    }

    obtenerDatos();
});

const obtenerDatos = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    miID.value = usuario.id;
    nombres.value = usuario.nombres;
    apellidos.value = usuario.apellidos;
    correo.value = usuario.correo;

}

const actualizar = async () => {

    if (nombres.value == '' || correo.value == '' || password.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        correo: correo.value,
        password: password.value
    }

    try {
        const { data } = await axios.put(baseURL + '/update/' + miID.value, datos, header);
        console.log(data);

        Swal.fire({
            icon: 'success',
            title: 'Credenciales actualizadas',
            text: 'Debes iniciar sesión',
            timer: 1500
        });

        route.push({path: '/login'});
        
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const expirado = () => {
      Swal.fire({
          icon: 'error',
          title: 'Sesión expirada',
          text: 'Debes iniciar sesión',
          timer: 1500
      });

      route.push({path: '/login'});
}


</script>

<style scoped></style>