<template>
  <div>
    <h3>Inicio</h3>

    <div class="row justify-content-center">

      <div class="col-lg-6 col-md-6 col-sm-6">
        <div class="card m-1 bg-primary text-white border border-0 shadow">
          <div class="card-body">
            <div class="row">
              <div class="col-9 col-md-9 col-sm-9">
                <h5 class="card-title display-6">{{ comprasmes }} </h5>
                <p class="card-subtitle">Compras del mes</p>
              </div>
              <div class="col-3 col-md-3 col-sm-3 display-4 icono-sm">
                <i class="fa fa-shopping-bag"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-6">
        <div class="card m-1 bg-dark text-white border border-0 shadow">
          <div class="card-body">
            <div class="row">
              <div class="col-9 col-md-9 col-sm-9">
                <h5 class="card-title display-6">{{ comprasanio }}</h5>
                <p class="card-subtitle">Compras del año</p>
              </div>
              <div class="col-3 col-md-3 col-sm-3 display-4 icono-sm">
                <i class="fa fa-area-chart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-6">
        <div class="card m-1 bg-info text-white border border-0 shadow">
          <div class="card-body">
            <div class="row">
              <div class="col-9 col-md-9 col-sm-9">
                <h5 class="card-title display-6">{{ ventasmes }}</h5>
                <p class="card-subtitle">Ventas del mes</p>
              </div>
              <div class="col-3 col-md-3 col-sm-3 display-4 icono-sm">
                <i class="fa fa-shopping-cart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-6">
        <div class="card m-1 bg-success text-white border border-0 shadow">
          <div class="card-body">
            <div class="row">
              <div class="col-9 col-md-9 col-sm-9">
                <h5 class="card-title display-6">{{ ventasanio }}</h5>
                <p class="card-subtitle">Ventas del año</p>
              </div>
              <div class="col-3 col-md-3 col-sm-3 display-4 icono-sm">
                <i class="fa fa-line-chart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card m-1">
          <div class="card-body">
            <h5 class="card-title">Compras y ventas menusales</h5>
            <apexchart width="100%" type="area" :options="options" :series="series"></apexchart>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card m-1">
          <div class="card-body">
            <h5 class="card-title">Productos más vendidos</h5>
            <apexchart width="100%" type="donut" :options="options2" :series="series2"></apexchart>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apexchart from 'vue3-apexcharts'

import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const route = useRouter();

const comprasmes = ref(0);
const comprasanio = ref(0);
const ventasmes = ref(0);
const ventasanio = ref(0);

const token = localStorage.getItem('token') || '';
const header = {
  headers: {
    'authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

let baseURL = 'http://localhost:3000/home/';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const options = ref({
  chart: {
    id: 'vuechart-example'
  },
  xaxis: {
    categories: meses
  }
});

const options2 = ref({
  chart: {
    id: 'vuechart-example2'
  },
  labels: []
});

const series = ref([]);
const series2 = ref([]);

onMounted(() => {

  if(token == '' || token == null){
    expirado();
  }

  obtenerComprasMes();
  obtenerComprasAnio();
  obtenerVentasMes();
  obtenerVentasAnio();
  obtenerTotales();
  obtenerVendidos();
});

const obtenerComprasMes = async () => {
  try {
    const { data } = await axios.get(baseURL + 'comprasmes', header);
    console.log(data);
    // comprasmes.value = parseFloat(data.data).toFixed(2);
    comprasmes.value = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(data.data);
  } catch (error) {
    console.log(error);
    // si el estado es 403 o 401, mostrar la alerta y redireccionar al login 
    if (error.response.status == 403 || error.response.status == 401) {
      expirado();
    }

  }
}

const obtenerComprasAnio = async () => {
  try {
    const { data } = await axios.get(baseURL + 'comprasanio', header);
    console.log(data);
    comprasanio.value = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(data.data);
  } catch (error) {
    console.log(error);
    if (error.response.status == 403 || error.response.status == 401) {
      expirado();
    }
  }
}

const obtenerVentasMes = async () => {
  try {
    const { data } = await axios.get(baseURL + 'ventasmes', header);
    console.log(data);
    // ventasmes.value = parseFloat(data.data).toFixed(2);
    ventasmes.value = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(data.data);
  } catch (error) {
    console.log(error);
    if (error.response.status == 403 || error.response.status == 401) {
      expirado();
    }
  }
}

const obtenerVentasAnio = async () => {
  try {
    const { data } = await axios.get(baseURL + 'ventasanio', header);
    console.log(data);
    ventasanio.value = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(data.data);
  } catch (error) {
    console.log(error);
    if (error.response.status == 403 || error.response.status == 401) {
      expirado();
    }
  }
}


const obtenerTotales = async () => {
  series.value = [];

  try {
    const { data } = await axios.get(baseURL + 'totalcompras', header);

    var datosMesCompra = [];
    for (let i = 0; i < meses.length; i++) {
      let mes = (i + 1);

      datosMesCompra[i] = 0;

      for (let j = 0; j < data.data.length; j++) {
        if (mes == data.data[j].mes) {
          datosMesCompra[i] = data.data[j].totales;
        }
      }
    }

    var datos = {
      name: 'Compras',
      data: datosMesCompra
    }
    series.value.push(datos);

  } catch (error) {
    console.log(error);
  }

  try {
    const { data } = await axios.get(baseURL + 'totalventas', header);

    var datosMesVenta = [];
    for (let i = 0; i < meses.length; i++) {
      let mes = (i + 1);

      datosMesVenta[i] = 0;

      for (let j = 0; j < data.data.length; j++) {
        if (mes == data.data[j].mes) {
          datosMesVenta[i] = data.data[j].totales;
        }
      }
    }

    var datos = {
      name: 'Ventas',
      data: datosMesVenta
    }
    series.value.push(datos);

  } catch (error) {
    console.log(error);
    if (error.response.status == 403 || error.response.status == 401) {
      expirado();
    }
  }
}


const obtenerVendidos = async () => {
  series2.value = [];

  try {
    const { data } = await axios.get(baseURL + 'masvendidos', header);

    var datos = [];
    var valores = [];
    for (let j = 0; j < data.data.length; j++) {
      valores[j] = data.data[j].total;
      datos[j] = data.data[j].producto;
    }

    series2.value = valores;

    options2.value = {
      chart: {
        id: 'vuechart-example2'
      },
      labels: datos
    };

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