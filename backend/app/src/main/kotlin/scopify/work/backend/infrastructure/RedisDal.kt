package scopify.work.backend.infrastructure

import com.github.salomonbrys.kotson.fromJson
import com.google.gson.Gson
import redis.clients.jedis.JedisPool
import redis.clients.jedis.JedisPoolConfig
import scopify.work.backend.model.IScopeRepository
import scopify.work.backend.model.ScopeSession
import java.time.Duration

class RedisDal(private val pool: JedisPool = createJedisPool()) : IScopeRepository {

    // Expire after 10 mins
    private val expiry = 600

    private fun sessionKey(id: String) = "session:$id"

    private fun setExpiry(id: String) = pool.resource.use { pool -> pool.expire(sessionKey(id), expiry) }

    override fun getSession(id: String): ScopeSession? {

        pool.resource.use { pool ->
            val session = Gson().fromJson<ScopeSession>(pool.get(sessionKey(id)) ?: return null)
            setExpiry(id)
            return session
        }
    }

    override fun writeSession(session: ScopeSession) {
        pool.resource.use { pool ->
            val sessionJson = Gson().toJson(session)
            pool.set(sessionKey(session.id), sessionJson)
            setExpiry(session.id)
        }
    }
}

fun createJedisPool(): JedisPool {
    val poolConfig = JedisPoolConfig()
    poolConfig.setMaxTotal(128)
    poolConfig.setMaxIdle(128)
    poolConfig.setMinIdle(16)
    poolConfig.setTestOnBorrow(true)
    poolConfig.setTestOnReturn(true)
    poolConfig.setTestWhileIdle(true)
    poolConfig.setMinEvictableIdleTimeMillis(Duration.ofSeconds(60).toMillis())
    poolConfig.setTimeBetweenEvictionRunsMillis(Duration.ofSeconds(30).toMillis())
    poolConfig.setNumTestsPerEvictionRun(3)
    poolConfig.setBlockWhenExhausted(true)

    return JedisPool(poolConfig, System.getenv("REDIS_URL") ?: "localhost")
}
