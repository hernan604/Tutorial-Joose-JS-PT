;
Class( "CalculadoraBase", {
  has : {
    resultado: { is : "rw", init: (function() { return 0 }) }
  },
  methods : {
    adicionar: function ( val1,val2 ) {
      this.setResultado( val1 + val2 );
      return this;
    },
    subtrair: function( val1,val2 ) {
      this.setResultado( val1 - val2 );
      return this;
    },
    multiplicar: function ( val1, val2 ) {
      this.setResultado( val1 * val2 );
      return this;
    },
    dividir: function( val1, val2 ) {
      this.setResultado( val1 / val2 );
      return this;
    },
    zerar: function( ) {
      this.setResultado( 0 );
      return this;
    }
  }
} )

Role( "RaizQuadrada", {
  methods: {
    raiz_quadrada: function( val1 ) {
      this.setResultado(  Math.sqrt( val1 )  );
      return this;
    }
  }
} )

Role( "Potencia" , {
  methods: {
    elevar: function ( val1, val2 ) {
      this.setResultado( Math.pow( val1, val2 ) );
      return this;
    }
  }
} )

Role( "CalculadoraView", {
  has: {
    elem_calculadora: { is: 'rw' }, //referencia ao objeto jquery que aponta para a div calculadora
    elem_operacoes: { is: 'rw' }, //referencia ao objeto div_operacoes_realizadas
  },
  methods: {
    imprimir_resultado: function () {
      if ( ! this.elem_calculadora ) return;
      this.elem_calculadora.html( this.resultado );
    }
  },
  after: {
    setResultado: function () {
      this.imprimir_resultado();
    },
    adicionar_operacao: function( operacao ) {
      if ( ! this.elem_operacoes ) return;
      var li_operacao = jQuery( "<li>" );
      li_operacao.html( operacao.operacao + "|" );
      for ( var i in operacao.valores ) {
        li_operacao.append( operacao.valores[ i ] + " " );
      }
      li_operacao.append( " = " + operacao.resultado );

      this.elem_operacoes.append( li_operacao );
    }
  }
} )

Role( "RegistraOperacoes" , {
  has: {
    operacoes: { is: "rw", init: ( function () { return [] } )() }
  },
  methods: {
    registrar_operacao: function( operacao, val1, val2 ) {
      var operacao = {
        operacao : operacao,
        valores  : {},
        resultado: this.resultado
      };
      if ( typeof val1 != "undefined" ) //da pra usar Joose Types e
          operacao.valores.val1 = val1; //evitar validação desnecessária de types
      if ( typeof val2 != "undefined" )
          operacao.valores.val2 = val2;
      this.adicionar_operacao( operacao );
    },
    adicionar_operacao: function ( operacao ) {
      this.operacoes.push( operacao );
    }
  },
  after: {
    raiz_quadrada : function (val1 ) {
      this.registrar_operacao( "raiz_quadrada", val1 );
    },
    adicionar   : function( val1, val2 ) {
      this.registrar_operacao( "adicionar", val1, val2 );
    },
    subtrair    : function ( val1, val2 ) {
      this.registrar_operacao( "subtrair", val1, val2 );
    },
    multiplicar : function( val1, val2 ) {
      this.registrar_operacao( "multiplicar", val1, val2 );
    },
    dividir     : function( val1, val2 ) {
      this.registrar_operacao( "dividir", val1, val2 );
    },
  }
} )





Type( "ExemploTipoNumerico" , {
  uses  : Joose.Type.Any,
  where : function ( val ) {
    if ( val == null ) return true; //se for nulo permite setar valor (eu simplesmente permiti uma excessão ao valor null)
    return false;                   //se não for nulo pode ser qualquer coisa, string, objeto, etc. vai retornar false e
                                    //vai rodar as regras de coerce abaixo. As regras de coerce são opcionais e servem
                                    //para transformar um valor recebido no valor que desejado.
  },
  coerce : [ //coerce transforma o valor no que eu quero
    {
      from  : Joose.Type.Any,
      via   : function ( val ) {
        var pattern_digits = /^(\d+)$/ig;
        if ( ! pattern_digits.test( val ) ) {
          return false;
        }
        return parseFloat( val );
      }
    }
  ]
} )

Type( "ExemploTipoPeso" , {
  uses  : Joose.Type.Any,
  where : function ( val ) {
    if ( val == null ) return true;
    return false;
  },
  coerce : [ //coerce transforma o valor no que eu quero
    {
      from  : Joose.Type.Any,
      via   : function ( val ) {
        var pattern_float = /^(\d+)(\.\d+){0,1}$/ig;
        if ( ! pattern_float.test( val ) ) {
          return false;
        }
        return val + " kg";
      }
    }
  ]
} )

Type( "ExemploTipoString", {
   uses : Joose.Type.Any,
  where : function ( val ) {
    if ( typeof val == "string" || val == null ) return true; //ta liberado pra setar nulo
    return false;
  },
  coerce: [
      //primeira regra
      {
        from : Joose.Type.Any,
         via : function ( val ) {
           console.log( Joose.Type.Any );
          if ( typeof val != "string" ) return ""+val; //transforma valor recebido em string
          return val;
        }
      }
  ]
} )

Class( "Pessoa", {
  has : {
    nome : {
            is : "rw",
           isa : Joose.Type.ExemploTipoString,
        coerce : true,
          lazy : true,
    },
    sobrenome : {
            is : "rw",
           isa : Joose.Type.ExemploTipoString,
        coerce : true,
    },
    idade : {
             is : "rw",
            isa : Joose.Type.ExemploTipoNumerico,
         coerce : true,
    },
    peso : {
             is : "rw",
            isa : Joose.Type.ExemploTipoPeso,
         coerce : true,
    },
  },
  methods : {
    andar : function () {
      //...
    },
  }
} )

Role( "Programador", {
  has : {
    linguagem : { is : "rw", required: true }
  },
  methods: {
    programar: function () { 
      console.log( "    programando...." );
    } 
  }
} )

Role( "Piloto", { 
  has: {
    carro : { is: "rw" }
  },
  methods : {
    pilotar : function () {
      console.log( "    pilotando..." );
    }
  }
} )

Role( "Mecanico", {
  has: {
    ferramenta: { is: "rw" }
  },
  methods: {
    consertar_carro: function () {
      console.log( "    consertando carro" );
    }
  }
} )



Role( "Dormir", {
  methods: {
    dormir: function () { 
      console.log( "  dormir...." );
    }
  }
} )

Role( "DescancoProgramador" , {
  does: Dormir,
  after: {
    programar : function() { 
      console.log("depois de programar: ");
      this.dormir() 
    },
  }
} )

Role( "DescancoPiloto" , {
  does: Dormir,
  after: {
    pilotar : function() { 
      console.log("depois de pilotar: ");
      this.dormir() 
    },
  }
} )

Role( "DescancoMecanico" , {
  does: Dormir,
  after: {
    consertar_carro : function() { 
      console.log("depois de consertar o carro:");
      this.dormir() 
    },
  }
} )




Role( "PreparoProgramador" , {
  before: {
    programar : function() { 
        console.log( "antes de programar:" );
        console.log( "  ligar o computador" );
        console.log( "  abrir o editor de texto" );
    }
  }
} )

Role( "PreparoPiloto" , {
  before: {
    pilotar : function() { 
        console.log( "antes de pilotar: " );
        console.log( "  entrar no carro" );
        console.log( "  ligar o carro" );
    }
  }
} )

Role( "PreparoMecanico" , {
  before: {
    consertar_carro : function() { 
        console.log( "antes de consertar carros: " );
        console.log( "  buscar caixa de ferramentas" );
        console.log( "  levantar o carro" );
    }
  }
} )





Class( "Barco", {
  has : {
    nome: { is: "ro", init: (function(){return"Barco"})() }
  },
  methods : {
    navegar: function () { 
      console.log( "sou um " + this.nome + " e vou nagevar." );
    }
  }
} )

Class( "Carro", {
  has : {
    nome: { is: "ro", init: (function(){return"Carro"})() }
  },
  methods : {
    pegar_estrada: function() { 
      console.log( "sou um " + this.nome + " e vou pegar a estrada." );
    }
  }
} )

Class( "Aviao", {
  has : {
    nome: { is: "ro", init: (function(){return"Aviao"})() }
  },
  methods : {
    voar: function () { 
      console.log( "Sou um " + this.nome + " e vou voar." );
    }
  }
} )

Class( "Trem", {
  has : {
    nome: { is: "ro", init: (function(){return"Trem"})() }
  },
  methods : {
    andar_no_trilho: function () { 
      console.log( "Sou um " + this.nome + " e vou andar nos trilhos." );
    }
  }
} )

Type( "Transporte" , {
  uses : Joose.Type.Any,
  where : function ( val ) { 
    return false;
  },
  coerce: [
    {
      from : Joose.Type.Any,
        via : function ( val ) { 
          switch ( val.toLowerCase() ) {

            case "barco":
              return new Barco(); 
              break;

            case "carro": 
              return new Carro(); 
              break;

            case "aviao":
              return new Aviao();
              break;

            case "trem":
              return new Trem();
              break;

            default: 
              return false;
              break
         }
      }
    }
  ]
} )

Class( "MeioDeTransporte" , {
  has : { 
    veiculo: { 
             is : "rw" ,
            isa : Joose.Type.Transporte,
         coerce : true,
    }
  },
  methods : { 
    veiculo_utilizado: function () {
      console.log( "Estou usando o veiculo: " + this.veiculo.nome );
    }
  }
} )











Class( "PessoaSimples" , { 
  has: {
    nome: { is: "rw" }
  }
})

Role( "Paraquedas" , {
  requires: [               //para usar essa role, tem que estar definido:
    'pular_do_aviao',       //metodo pular do aviao. 
    'setNivel_paraquedista' //atributo nivel_paraquedista
  ],
  has : {
    cor_paraquedas: { is : "rw", init: ( function(){return"paraquedas azul"})() }
  },
  methods: {
    abrir_paraquedas: function () { 
      console.log( "abriu paraquedas" );
    },
    pular: function () { 
      this.pular_do_aviao();
    } 
  }
} )

Class( "Paraquedista" , {
  isa : PessoaSimples,
  does: [Paraquedas],
  has : {
    nivel_paraquedista: { is : "rw" }
  },
  methods : { 
    pular_do_aviao : function () {
      console.log( "pulando " );
    }
  }
} )





Module( "Automovel.Motor", function() { 
  Role( "Corrida" , { 
    has: { 
      turbo: { is: "rw", init: true },
      lugares: { is: "rw", init: 1 },
      potencia: { is: "rw" }
    },
    methods: { 
      acelerar_fundo: function () {
        console.log( "carro de corrida, acelerando fundo ..." );
      } 
    }
  } ),
  Role( "Passeio" , { 
    has: { 
      turbo: { is: "rw", init: false },
      lugares: { is: "rw", init: 4 }
    },
    methods : { 
      andar_na_boa: function () { 
        console.log( "carro de passeio, andar na boa ..." );
      }
    }
  } )
} ),

Module( "Automovel.Modelo", function() { 
    Class( "Ferrari" , {
      has: { 
        modelo: { is: "rw" , init: "ferrari testarrosa" }
      },
      does: [ Automovel.Motor.Corrida ]
    } ),
    Class( "Porshe", {
      has: { 
        modelo: { is: "rw" , init: "porshe 911" }
      },
      does: [ Automovel.Motor.Corrida ]
    } ),
    Class( "Fusca", {
      has: { 
        modelo: { is: "rw" , init: "fusca antigo" }
      },
      does: [ Automovel.Motor.Passeio ]
    } ),
    Class( "Monza" ,  { 
      has: { 
        modelo: { is: "rw" , init: "monza 2.0" }
      },
      does: [ Automovel.Motor.Passeio ]
    } )
} )





Class("SingletonAloAlo", {
    does: [Joose.Singleton],
    has: {
        count_chamadas_alo_alo: {
            is: "rw",
            init: function() { return 0 }
        }
    },
    methods: {
        alo_alo_from_singleton: function() {
            this.setCount_chamadas_alo_alo( this.getCount_chamadas_alo_alo() + 1 );
            console.log( "alô alô" );
        }
    }
})




Class( "EstiloCorrida", {
  methods: {
    acelerar: function() {
      console.log( "Acelerando muito rapido pois este motor é de corrida" );
    },
    brecar: function() {
      console.log( "Brecando com freios ABS... carro de corrida sempre tem" );
    },
  } 
} )
Class( "Estilo4x4", {
  methods: {
    acelerar: function() {
      console.log( "Acelerando o máximo com este motor de 4x4." )
    },
    brecar: function() {
      console.log( "Brecando sem abs neste modelo 4x4" );
    },
  } 
} )

Class( "Lamborghini", {
  has: { 
    engine: {
      is: "rw"
    }
  },
  methods: {
    acelerar: function () {   
      this.engine.acelerar();
    },
    brecar: function() {  
      this.engine.brecar();
    }
  },
  after: {
    setEngine: function () {
      console.log( "Configurada classe com motor: " + this.engine.meta._name );
      console.log( "Configurada classe com motor: " + this.toString() );
    }
  }
} )

Class( "Jeep", {
  has: { 
    engine: {
      is: "rw"
    }
  },
  methods: {
    acelerar: function () {   
      this.engine.acelerar();
    },
    brecar: function() {  
      this.engine.brecar();
    }
  },
  after: {
    setEngine: function () {
      console.log( "Configurada classe com motor: " + this.engine.meta._name );
      console.log( "Configurada classe com motor: " + this.toString() );
    }
  }
} )




Type( "TipoHarddisk", {
  uses: Joose.Type.Any,
  where: function ( harddisk ) {
    if ( harddisk && harddisk.meta && harddisk.meta._name == "Harddisk" ) return harddisk;
    return false;
  },
  coerce: [
    {
      from  : Joose.Type.Any,
      via   : function ( harddisk ) {
        if ( ! harddisk ) return null;
        if ( /array/ig.test( harddisk.constructor ) ) {
          var hdds = [];
          for ( var i in harddisk ) {
            hdds.push( new Harddisk( harddisk[ i ] ) );
          }
          return hdds;
        }
        else if ( /object/ig.test( harddisk ) ) {
          return [ new Harddisk( harddisk ) ];
        }
      }
    },
  ]
} )  


Type( "TipoGabinete" , {
  uses  : Joose.Type.Any,
  where : function ( gabinete ) {
    if ( gabinete && gabinete.meta && gabinete.meta._name == "Gabinete" ) return gabinete;//se já for tipo gabinete retorna ele
    return false;
  },
  coerce : [
    {
      // Define HARD DISKS
      from  : Joose.Type.Any,
      via   : function ( gabinete ) {
        if ( ! gabinete || ! gabinete.hdd ) return null;
        if ( /array/ig.test( gabinete.hdd.constructor ) ) {
          var hdds = [];
          for ( var i in gabinete.hdd ) {
            hdds.push( new Harddisk( gabinete.hdd[ i ] ) );
          }
          gabinete.hdd = hdds;
        }
        else if ( /object/ig.test( gabinete.hdd ) ) {
          gabinete.hdd = [ new Harddisk( gabinete.hdd ) ];
        }
        return null; //Tem que retornar nullo para varios coerces
      }
    },
    {
      //Define Placa Mãe
      from : Joose.Type.Any,
       via : function ( gabinete ) {
        if ( ! gabinete || !gabinete.placa_mae ) return null;
        if ( /object/ig.test( gabinete.placa_mae.constructor ) ) {
          if ( gabinete.placa_mae.modelo ) {
            gabinete.placa_mae = new PlacaMae( gabinete.placa_mae );
          }
        }
        else if ( /array/ig.test( gabinete.placa_mae.constructor ) ) {
          console.warn( "Gabinete só aceita uma placa mãe mas foi passado array." );
        }
        return null; //Tem que retornar nullo para varios coerces
      }
    },
    {
      from  : Joose.Type.Any,
      via   : function ( gabinete ) {
        if ( gabinete ) return new Gabinete( gabinete );
        return false;
      }
    }
  ]
} )

Type( "TipoTeclado" , {
  uses : Joose.Type.Any,
  where : function ( teclado ) {
    if ( teclado && teclado.meta && teclado.meta._name == "Teclado" ) return teclado; //se ja for teclado retorna ele
    return false;
  },
  coerce: [
    {
      //Define Teclado
      from : Joose.Type.Any,
       via : function ( teclado ) {
        if ( ! teclado ) return null;
        if ( /object/ig.test( teclado.constructor ) ) {
          return new Teclado( teclado );
        }
        return null;
      } 
    },
  ]
} )

Type( "TipoMonitor", {
  uses: Joose.Type.Any,
  where : function ( monitor ) {
    if ( monitor && monitor.meta && monitor.meta._name == "Monitor" ) return monitor; //se ja for monitor retorna ele
    return false;
  },
  coerce: [
    {
      from : Joose.Type.Any,
      via : function ( monitor ) {
        if ( ! monitor  ) return null;
        if ( /object/ig.test( monitor.constructor ) ) {
          return new Monitor( monitor );
        }
        else if ( /array/ig.test( monitor.constructor ) ) {
          var monitores = [];
          for ( var i in monitor ) {
            monitores.push( new Monitor( monitor[ i ] ) );
          }
          return monitores;
        }
      }
    }
  ]
} )

Type( "TipoMouse", {
  uses: Joose.Type.Any,
  where: function ( mouse ) {
    if ( mouse && mouse.meta && mouse.meta._name == "Mouse" ) return mouse;
    return false;
  } ,
  coerce: [
    {
      from : Joose.Type.Any,
      via : function ( mouse ) {
        if ( ! mouse )  return null;
        if ( /object/ig.test( mouse.constructor ) ) {
          return new Mouse( mouse );
        }
      }
    }
  ]
} )

Class( "Mouse" , {
  has : {
      marca : { is : "rw" },
    com_fio : { is : "rw" , init: false }
  }
} )

Class( "Teclado", {
  has : {
      marca : { is : "rw" },
    com_fio : { is : "rw" , init: false },
  }
} )

Class( "Monitor" , {
  has : {
        marca : { is : "rw" },
    polegadas : { is : "rw" }
  }
} )

Class( "Harddisk", {
  has: {
      marca      : { is : "rw" },
    tamanho      : { is : "rw" },
    espaco_livre : { is : "rw" },
    unidade      : { is : "rw" },
  },
  methods: {
    formatar: function () {
      var max_free_space = this.tamanho;
      this.setEspaco_livre( max_free_space );
    }
  }
} )

Class( "PlacaMae" , {
  has : {
    modelo : {
      is: "rw"
    },
    marca: {
      is : "rw"
    }
  },
  methods : {

  },
  after: {
    setModelo: function ( modelo )  {
      if ( /^asus/ig.test( modelo ) ) {
        this.setMarca( "Asus" );
      }
    }
  }
} )

Class( "Gabinete" , {
  has: {
    marca: {
      is: "rw"
    },
    baias: {
      is: "rw"
    },
    hdd: {
      is: "rw"
    },
    placa_mae: {
      is: "rw"
    },
  },
  methods: {
  },
  after: {
    setMarca: function () {
      console.log( "Marca gabinete: " + this.marca );
      console.log( "Marca gabinete: " + this.marca );
      console.log( "Marca gabinete: " + this.marca );
    } 
  }
} )


Class( "Computador" , {
  has : {
    gabinete  : {
          is : "rw",
         isa : Joose.Type.TipoGabinete,
      coerce : true,
        lazy : true,
    },
    teclado   : {
          is : "rw",
         isa : Joose.Type.TipoTeclado,
      coerce : true,
    },
    mouse     : {
          is : "rw" ,
         isa : Joose.Type.TipoMouse,
      coerce : true,
    },
    monitor   : { 
          is : "rw",
         isa : Joose.Type.TipoMonitor,
      coerce : true,
    },
    is_ligado : { is : "rw", init: false }
  },
  methods : {
    ligar: function() {
      console.log( "Ligando computador...." );
      this.setIs_ligado( true );
    },
    desligar: function() {
      if ( this.is_ligado ) 
        console.log( "Desligando computador..." );
      else 
        console.log( "Computador já está desligado" );
    }
  },
  after: {
    initialize: function ( args ) {
      console.log( "AFTER método initialize chamado " );
      console.log( args );
      console.log( "metodo initialize foi chamado com os argumentos acima ^^" );
    }
  }
} )




Class( "PessoaExemploAroundEOverride", {

  // Métodos 

  methods: {
    dizer_frase: function ( frase ) {
      return "dizendo: " + frase ;
    },
    perguntar_frase: function( pergunta ) {
      return "perguntando: " + pergunta;
    },
  },

  // Meus overrides

  override: {
    dizer_frase: function( frase ) {
      return this.SUPER( false ) + " - OVERRIDE";
    }
  },

  //Meus arounds

  around: {
    perguntar_frase: function ( original, pergunta ) { //original é a referencia ao método original
      return ( pergunta && pergunta.length > 10 ) 
        ? original( pergunta )        //chama o método original
        : "pergunta muito curta";     //não chama método orignal e retorna este valor
    }
  },
} )


