(ns reajure.interop
  (:require [clojure.string :as str]))

;; Available component `tags` must be statically declared since component object is not available in clj
(def tags '[vw
            txt
            ipt
            lbl
            btn])

(defn parse-kw-style-props 
  "Convert cljs style keyword shorthands to their string equivalents.
   e.g. :flx-1 -> 'flx1' || :jc-sb -> 'jcSB'."
  [props sk]
  (if (vector? (get props sk))
    (assoc props sk
           (mapv (fn [v]
                   (if (keyword? v) (let [k (name v)
                                          [k1 k2] (str/split k #"-")]
                                      (if-not k2 k1 (str/join "" [k1 (str/upper-case k2)])))
                       v))
                 (get props sk)))
    props))

(comment
  ;; object style 
  (parse-kw-style-props {:style {:flex 1}} :style)
  ;; vector style, with keyword shorthand
  (parse-kw-style-props {:style [:flx-1]} :style))

(defn parse-style-props
  "Converts cljs `props` to js props."
  [props]
  (-> props
      (parse-kw-style-props :style)
      (parse-kw-style-props :textStyle)))

