<?php
$radius = "1000"; // Radio de búsqueda en Metros
$disableClusteringAtZoom = 21;
$masFiltrosCss = 'oculto';

$user_sabores = false;
if (isset($_POST['user_sabores'])) {
  $user_sabores = $_POST['user_sabores'];
} elseif (isset($_GET['user_sabores'])) {
  $user_sabores = $_GET['user_sabores'];
}

$user_origen = 'Todas';
if (isset($_POST['user_origen'])) {
  $user_origen = $_POST['user_origen'];
} elseif (isset($_GET['user_origen'])) {
  $user_origen = $_GET['user_origen'];
}

$borigen_pampeana = 0;
if (isset($_POST['borigen_pampeana'])) {
  $borigen_pampeana  = $_POST['borigen_pampeana'];
} elseif (isset($_GET['borigen_pampeana'])) {
  $borigen_pampeana  = $_GET['borigen_pampeana'];
}

$borigen_nea = 0;
if (isset($_POST['borigen_nea'])) {
  $borigen_nea  = $_POST['borigen_nea'];
} elseif (isset($_GET['borigen_nea'])) {
  $borigen_nea  = $_GET['borigen_nea'];
}

$borigen_noa = 0;
if (isset($_POST['borigen_noa'])) {
  $borigen_noa  = $_POST['borigen_noa'];
} elseif (isset($_GET['borigen_noa'])) {
  $borigen_noa  = $_GET['borigen_noa'];
}

$borigen_cuyana = 0;
if (isset($_POST['borigen_cuyana'])) {
  $borigen_cuyana  = $_POST['borigen_cuyana'];
} elseif (isset($_GET['borigen_cuyana'])) {
  $borigen_cuyana  = $_GET['borigen_cuyana'];
}

$borigen_patagonica = 0;
if (isset($_POST['borigen_patagonica'])) {
  $borigen_patagonica  = $_POST['borigen_patagonica'];
} elseif (isset($_GET['borigen_patagonica'])) {
  $borigen_patagonica  = $_GET['borigen_patagonica'];
}

$user_latlng_default = array("-34.60371794474704","-58.38157095015049"); // El Obelisco
$user_latlng = null;
if (isset($_POST['user_latlng'])) {
  $user_latlng = $_POST['user_latlng']; // "lat lng"
} elseif (isset($_GET['user_latlng'])) {
  $user_latlng = $_GET['user_latlng'];
}

$especie_id_busqueda = '';
if (isset($_POST['especie_id'])) {
  $especie_id_busqueda = $_POST['especie_id'];
} elseif (isset($_GET['especie_id'])) {
  $especie_id_busqueda = $_GET['especie_id'];
}

$busqueda  = "";
if (isset($_GET['colaborativo'])) {
    $busqueda = "SQL custom";
} else {
  if ((isset($especie_id_busqueda)) && (is_numeric($especie_id_busqueda)) && ($especie_id_busqueda > 0)) {
    $busqueda .= "especie una /";
  } else {
    $busqueda .= "especie todas /";
  }

  if (!empty($user_latlng) && (strlen($user_latlng) > 1)) {
    $arr_user_latlng = explode(" ", $user_latlng);
    $user_lat = $arr_user_latlng[0];
    $user_lng = $arr_user_latlng[1];

    if (is_numeric($user_lat) && is_numeric($user_lng)) {
      $busqueda .= " donde marker /";
    } else {
      $busqueda .= " donde ciudad /";
    }
  } else {
    $busqueda .= " donde ciudad /";
  }

  if ($busqueda == "especie todas / donde ciudad /") {
    $busqueda = "";
  }

  if ((isset($user_sabores)) && (is_numeric($user_sabores)) && ($user_sabores > 0)) {
    $busqueda .= " con sabores /";
  }

  if ($user_origen !== 'Todas') {
    $busqueda .= " con origen ".$user_origen." /";
  }

  if ($borigen_pampeana > 0) {
    $busqueda .= " con pampeana ".$borigen_pampeana." /";
  }

  if ($borigen_nea > 0) {
    $busqueda .= " con nea ".$borigen_nea." /";
  }

  if ($borigen_noa > 0) {
    $busqueda .= " con noa ".$borigen_noa." /";
  }

  if ($borigen_cuyana > 0) {
    $busqueda .= " con cuyana ".$borigen_cuyana." /";
  }

  if ($borigen_patagonica > 0) {
    $busqueda .= " con patagonica ".$borigen_patagonica." /";
  }

  if (isset($arbol_id) && ($arbol_id > 0)) {
    $busqueda = " un arbol";
  }

  if (((isset($user_sabores)) && (is_numeric($user_sabores)) && ($user_sabores > 0)) ||
    ($user_origen !== 'Todas') ||
    ($borigen_pampeana > 0) ||
    ($borigen_nea > 0) ||
    ($borigen_noa > 0) ||
    ($borigen_cuyana > 0) ||
    ($borigen_patagonica > 0)
  ) {
    $masFiltrosCss = "visible";
  }
}
?>

<form action="<?php echo $APP_URL; ?>/index.php#mapa" method="post" id="busca_arboles">
  <div class="row">
    <div class="col-xs-12">
      <div class="form-group">
        <h3>¿Dónde?</h3>
        <div class="radio">
          <label>
            <input type="radio" id="rdonde-ciudad" name="rdonde" value="0" <?php echo (stripos($busqueda, 'marker') == 0) ? 'checked' : '' ?>>
            en todo el mapa
          </label>
          <label>
            <input type="radio" id="rdonde-mapa" name="rdonde" value="<?php echo $user_latlng_default[0].' '.$user_latlng_default[1] ?>" <?php echo (stripos($busqueda, 'marker') > 0) ? 'checked' : '' ?>>
            marcar en el mapa
          </label>
        </div>
        <input type="hidden" value="<?php echo (isset($user_lat) && isset($user_lng)) ? $user_lat.' '.$user_lng : '' ?>" name="user_latlng" id="user_latlng">
        <input type="hidden" name="radio" value="<?php echo $radius ?>">
      </div>
    </div>

    <div class="col-xs-12">
      <div class="form-group">
        <h3 class="pull-left">
          ¿Qué especie?
          <a href="#" id="borrar_especie_id">
            <i class="fa fa-trash-o"></i>
          </a>
        </h3>
        <select class="form-control input-lg" data-style="btn-default" name="especie_id" id="especie_id" data-live-search="true" data-current="<?php echo $especie_id_busqueda ?>">
          <!-- Options loaded via ajax -->
        </select>
      </div>
    </div>

    <div class="col-xs-12 <?php echo $masFiltrosCss; ?>" id="mas-filtros">
      <div class="form-group">
        <h3>Sabores</h3>
        <label for="user_sabores">
          <input type="checkbox" name="user_sabores" id="user_sabores" value="1" <?php echo ((isset($user_sabores)) && ($user_sabores > 0)) ? 'checked' : '' ?>>
          frutales y medicinales <!-- <span class="label label-warning">beta</span> -->
        </label>
      </div>

      <div class="form-group">
        <h3>Origen</h3>
        <div class="radio">
          <label>
            <input type="radio" id="rorigen-nativas" name="user_origen" value="Nativo/Autóctono" <?php echo (stripos($busqueda, 'Nativo') > 0) ? 'checked' : '' ?>>
            nativas
          </label>
          <label>
            <input type="radio" id="rorigen-exoticas" name="user_origen" value="Exótico" <?php echo (stripos($busqueda, 'Exótico') > 0) ? 'checked' : '' ?>>
            exóticas
          </label>
          <a href="#" id="borrar_origen">
            <i class="fa fa-trash-o"></i>
          </a>
        </div>

        <div class="regiones">
          <h3>Región de origen</h3>
          <label for="borigen_pampeana"> <input type="checkbox" name="borigen_pampeana" id="borigen_pampeana" value="1" <?php echo ($borigen_pampeana > 0) ? 'checked' : '' ?>>
            Pampeana
          </label>
          <label for="borigen_nea"> <input type="checkbox" name="borigen_nea" id="borigen_nea" value="1"  <?php echo ($borigen_nea > 0) ? 'checked' : '' ?>>
            NEA
          </label>
          <label for="borigen_noa"> <input type="checkbox" name="borigen_noa" id="borigen_noa" value="1"  <?php echo ($borigen_noa > 0) ? 'checked' : '' ?>>
            NOA
          </label>
          <label for="borigen_cuyana"> <input type="checkbox" name="borigen_cuyana" id="borigen_cuyana" value="1"  <?php echo ($borigen_cuyana > 0) ? 'checked' : '' ?>>
            Cuyana
          </label>
          <label for="borigen_patagonica"> <input type="checkbox" name="borigen_patagonica" id="borigen_patagonica" value="1"  <?php echo ($borigen_patagonica > 0) ? 'checked' : '' ?>>
            Patagónica
          </label>
        </div>
      </div>
    </div>
    <div class="col-xs-12" id="mas-filtros-btn-container">
      <a href="#" class="btn btn-default mas-filtros">
        <?php echo ($masFiltrosCss == 'oculto') ? "mostrar" : "ocultar" ?> filtros
      </a>
    </div>
  </div>
  <input name="Buscar" type="submit" value="Buscar" class="btn btn-primary btn-lg btn-block">
</form>
