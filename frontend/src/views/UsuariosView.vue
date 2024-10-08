<template>
    <div class="card">
        <div class="card-body">

            <div class="row">
                <div class="col-md-6">
                    <h5 class="card-title">Usuarios</h5>
                </div>
                <div class="col-md-6 text-end">
                    <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalUsuario">
                        <i class="fa fa-plus"></i>
                        Nuevo
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in usuarios" :key="item">
                            <td>{{ item.id }}</td>
                            <td>{{ item.nombres }}</td>
                            <td>{{ item.apellidos }}</td>
                            <td>{{ item.correo }}</td>
                            <td>
                                <!-- <a href="#" class="btn btn-primary btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a> -->
                                <button @click="seleccionar(item)" class="btn btn-warning btn-sm">
                                    <i class="fa fa-edit"></i>
                                </button>

                                <!-- <button v-if="item.estado == 0" @click="eliminar(item.id)" class="btn btn-danger btn-sm">
                                    <i class="fa fa-trash"></i>
                                </button> -->

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="modalUsuario" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Datos del usuario</h1>
                    <button type="button" @click="reset()" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form action="#" class="needs-validation" novalidate>
                    <div class="modal-body">

                        <div class="mb-3">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" v-model="nombres" id="nombres" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" v-model="apellidos" id="apellidos" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" v-model="correo" id="correo" class="form-control" placeholder="example@example.com" />
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" v-model="password" id="password" class="form-control" />
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="reset()" class="btn btn-secondary"
                            data-bs-dismiss="modal">Cerrar</button>
                        <button v-if="seleccionado && seleccionado.id == null" type="button" @click="registrar()"
                            class="btn btn-primary">Guardar</button>
                        <button v-else type="button" @click="actualizar()" class="btn btn-primary">Actualizar</button>
                    </div>
                </form>
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

const usuarios = ref([]);
let baseURL = 'http://localhost:3000/users';

const nombres = ref('');
const apellidos = ref('');
const correo = ref('');
const password = ref('');

const seleccionado = ref({});

const token = localStorage.getItem('token') || '';
const header = {
  headers: {
    'authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

onMounted(() => {

    if(token == '' || token == null){
        expirado();
    }

    obtenerDatos();
});

const obtenerDatos = async () => {
    try {
        const { data } = await axios.get(baseURL, header);
        console.log(data);

        usuarios.value = data.data;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const registrar = async () => {
    if(nombres.value == '' || correo.value == '' || password.value == '') {
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
        const { data } = await axios.post(baseURL + '/store', datos, header);
        console.log(data);
        obtenerDatos();
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalUsuario');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();

    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

// seelccionar
const seleccionar = (item) => {
    seleccionado.value = item;
    nombres.value = item.nombres;
    apellidos.value = item.apellidos;
    correo.value = item.correo;
    var myModalEl = document.getElementById('modalUsuario');
    var modal = new bootstrap.Modal(myModalEl);
    modal.show();
}

// actualizar
const actualizar = async () => {

    if(nombres.value == '' || correo.value == '' || password.value == '') {
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
        const { data } = await axios.put(baseURL + '/update/' + seleccionado.value.id, datos, header);
        console.log(data);
        obtenerDatos();
        reset();
        var myModalEl = document.getElementById('modalUsuario');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const reset = () => {
    nombres.value = '';
    apellidos.value = '';
    correo.value = '';
    password.value = '';

    seleccionado.value = {};
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