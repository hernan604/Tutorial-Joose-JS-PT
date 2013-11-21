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
    elem_calculadora: { is: 'rw', init: ( function(){return 0;})() } //objeto jquery que aponta para a div calculadora
  },
  methods: {
    imprimir_resultado: function () {
      alert( this.elem_calculadora );
      this.elem_calculadora.html( this.resultado );
    }
  },
  after: {
    setResultado: function () { 
      this.imprimir_resultado();
    }
  }
} )
