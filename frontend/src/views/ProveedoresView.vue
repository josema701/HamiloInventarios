<template>
    <div class="card">
        <div class="card-body">

            <div class="row">
                <div class="col-md-6">
                    <h5 class="card-title">Proveedores</h5>
                </div>
                <div class="col-md-6 text-end">
                    <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                        data-bs-target="#modalProveedor">
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
                            <th>Empresa</th>
                            <th>Contacto</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in proveedores" :key="item">
                            <td>{{ item.id }}</td>
                            <td>{{ item.empresa }}</td>
                            <td>{{ item.contacto }}</td>
                            <td>{{ item.telefono }}</td>
                            <td>{{ item.correo }}</td>
                            <td>{{ item.direccion }}</td>
                            <td>
                                <span v-if="item.estado" class="badge text-bg-success">Activo</span>
                                <span v-else class="badge text-bg-danger">Inactivo</span>
                            </td>
                            <td>
                                <!-- <a href="#" class="btn btn-primary btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a> -->
                                <button @click="seleccionar(item)" class="btn btn-warning btn-sm">
                                    <i class="fa fa-edit"></i>
                                </button>

                                <button v-if="item.estado" @click="estado(item.id)" class="btn btn-danger btn-sm">
                                    <i class="fa fa-ban"></i>
                                </button>
                                <button v-else @click="estado(item.id)" class="btn btn-primary btn-sm">
                                    <i class="fa fa-check"></i>
                                </button>
                                <button v-if="item.estado == 0" @click="eliminar(item.id)" class="btn btn-danger btn-sm">
                                    <i class="fa fa-trash"></i>
                                </button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>


    <!-- Modal -->
    <div class="modal fade" id="modalProveedor" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Datos del proveedor</h1>
                    <button type="button" @click="reset()" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form action="#" class="needs-validation" novalidate>
                    <div class="modal-body">

                        <div class="mb-3">
                            <label for="empresa" class="form-label">Empresa</label>
                            <input type="text" v-model="empresa" id="empresa" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="contacto" class="form-label">Nombre del contacto</label>
                            <input type="text" v-model="contacto" id="contacto" class="form-control"
                                placeholder="Jhon Doe" required />
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="telefono" class="form-label">Teléfono</label>
                                    <input type="text" v-model="telefono" id="telefono" class="form-control"
                                        placeholder="+591 XXXXXXXX" required />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="correo" class="form-label">Correo</label>
                                    <input type="email" v-model="correo" id="correo" class="form-control"
                                        placeholder="example@example.com" />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="direccion" class="form-label">Dirección</label>
                            <input type="text" v-model="direccion" id="direccion" class="form-control" />
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

const proveedores = ref([]);
let baseURL = 'http://localhost:3000/proveedores';

const empresa = ref('');
const contacto = ref('');
const telefono = ref('');
const correo = ref('');
const direccion = ref('');

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

        proveedores.value = data.data;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const registrar = async () => {

    if(empresa.value == '' || contacto.value == '' || telefono.value == '' || correo.value == '' || direccion.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        empresa: empresa.value,
        contacto: contacto.value,
        telefono: telefono.value,
        correo: correo.value,
        direccion: direccion.value,
        estado: 1
    }

    try {
        const { data } = await axios.post(baseURL + '/store', datos, header);
        console.log(data);
        obtenerDatos();
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalProveedor');
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

    empresa.value = item.empresa;
    contacto.value = item.contacto;
    telefono.value = item.telefono;
    correo.value = item.correo;
    direccion.value = item.direccion;

    var myModalEl = document.getElementById('modalProveedor');
    var modal = new bootstrap.Modal(myModalEl);
    modal.show();
}

// actualizar
const actualizar = async () => {

    if(empresa.value == '' || contacto.value == '' || telefono.value == '' || correo.value == '' || direccion.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        empresa: empresa.value,
        contacto: contacto.value,
        telefono: telefono.value,
        correo: correo.value,
        direccion: direccion.value,
        estado: seleccionado.value.estado
    }

    try {
        const { data } = await axios.put(baseURL + '/update/' + seleccionado.value.id, datos, header);
        console.log(data);
        obtenerDatos();
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalProveedor');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();

    } catch (error) {
        console.log(error);

        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

// ESTADO
const estado = async(id) => {
    try{
        const { data } = await axios.get(baseURL + '/estado/' + id, header);
        obtenerDatos();
    } catch (error) {
        console.log(error);
    }
}

// ELIMINAR
const eliminar = async(id) => {
    try{
        const { data } = await axios.delete(baseURL + '/delete/' + id, header);
        obtenerDatos();
    } catch (error) {
        console.log(error);
    }
}

const reset = () => {
    empresa.value = '';
    contacto.value = '';
    telefono.value = '';
    correo.value = '';
    direccion.value = '';
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